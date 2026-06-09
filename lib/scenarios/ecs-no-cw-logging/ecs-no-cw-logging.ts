import { Construct } from "constructs";
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface EcsNoCwLoggingProps {
  cluster: ecs.ICluster;
}

export class EcsNoCwLogging extends Construct {
  constructor(scope: Construct, id: string, props: EcsNoCwLoggingProps) {
    super(scope, id);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
    });

    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/image`),
      memoryLimitMiB: 512,

      // Explicitly no CloudWatch logging to make debugging harder
      logging: undefined,
    });

    // Instantiate an Amazon ECS Service
    new ecs.FargateService(this, 'Service', {
      cluster: props.cluster,
      taskDefinition,
      minHealthyPercent: 100,
      circuitBreaker: { enable: true },
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
  }

}
