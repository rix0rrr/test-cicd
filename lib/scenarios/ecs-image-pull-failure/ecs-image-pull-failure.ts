import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib/core';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface EcsImagePullFailureProps {
  cluster: ecs.ICluster;
}

export class EcsImagePullFailure extends Construct {
  constructor(scope: Construct, id: string, props: EcsImagePullFailureProps) {
    super(scope, id);

    const executionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      executionRole,
    });

    taskDefinition.addContainer('DefaultContainer', {
      // Nonexistent image tag to trigger CannotPullContainerError
      image: ecs.ContainerImage.fromRegistry(`${cdk.Aws.ACCOUNT_ID}.dkr.ecr.${cdk.Aws.REGION}.amazonaws.com/cdk-hnb659fds-container-assets-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}:nonexistent-tag-that-does-not-exist`),
      memoryLimitMiB: 512,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'app',
      }),
    });

    new ecs.FargateService(this, 'Service', {
      cluster: props.cluster,
      taskDefinition,
      circuitBreaker: { enable: true },
      assignPublicIp: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
  }
}

