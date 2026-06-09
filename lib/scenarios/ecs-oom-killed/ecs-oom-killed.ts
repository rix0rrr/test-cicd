import { Construct } from "constructs";
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface EcsOomKilledProps {
  cluster: ecs.ICluster;
}

export class EcsOomKilled extends Construct {
  constructor(scope: Construct, id: string, props: EcsOomKilledProps) {
    super(scope, id);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
    });

    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/image`),
      memoryLimitMiB: 512,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'oom',
      }),
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
