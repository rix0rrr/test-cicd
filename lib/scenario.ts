import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

import { Construct } from 'constructs';
import { InvalidResourceProps } from './scenarios/invalid-resource-props/invalid-resource-props';
import { AutoImportWrongRetention } from './scenarios/autoimport-wrong-retention/autoimport-wrong-retention';
import { EcsExitOnStartup } from './scenarios/ecs-exit-on-startup/ecs-exit-on-startup';
import { EcsHealthCheckFailure } from './scenarios/ecs-health-check-failure/ecs-health-check-failure';
import { EcsImagePullFailure } from './scenarios/ecs-image-pull-failure/ecs-image-pull-failure';
import { EcsNoCwLogging } from './scenarios/ecs-no-cw-logging/ecs-no-cw-logging';
import { EcsOomKilled } from './scenarios/ecs-oom-killed/ecs-oom-killed';
import { CircularDependencies } from './scenarios/circular-dependencies/circular-dependencies';

export class ScenarioStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new ScenarioStack(this, 'Stack');
  }
}

export class ScenarioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an ECS cluster
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    void cluster;

    // new InvalidResourceProps(this, 'Props');
    // new AutoImportWrongRetention(this, 'AutoImportWrongRetention')
    // new CircularDependencies(this, 'Circs', { vpc });
    // new EcsExitOnStartup(this, 'ExitOnStartup', { cluster });
    new EcsHealthCheckFailure(this, 'HealthCheck', { cluster, vpc });
    // new EcsImagePullFailure(this, 'ImagePull', { cluster });
    // new EcsNoCwLogging(this, 'NoLogging', { cluster });
    // new EcsOomKilled(this, 'Oom', { cluster });
  }
}
