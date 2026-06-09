import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib/core';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Platform } from "aws-cdk-lib/aws-ecr-assets";

export interface EcsHealthCheckFailureProps {
  vpc: ec2.IVpc;
  cluster: ecs.ICluster;
}

export class EcsHealthCheckFailure extends Construct {
  constructor(scope: Construct, id: string, props: EcsHealthCheckFailureProps) {
    super(scope, id);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
    });

    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/image`, {
        platform: Platform.LINUX_AMD64,
      }),
      memoryLimitMiB: 512,
      portMappings: [{ containerPort: 8080 }],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'hcf',
      }),
    });

    // Instantiate an Amazon ECS Service
    const service = new ecs.FargateService(this, 'Service', {
      cluster: props.cluster,
      taskDefinition,
      circuitBreaker: {
        enable: true,
      },
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      assignPublicIp: true,
    });

    // ALB with health check that will fail (app doesn't serve HTTP)
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc: props.vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('Listener', { port: 80 });
    listener.addTargets('Target', {
      port: 8080,
      targets: [service],
      healthCheck: {
        path: '/health',
        interval: cdk.Duration.seconds(10),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
      },
    });
  }
}
