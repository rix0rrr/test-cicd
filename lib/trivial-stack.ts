import * as sns from '@aws-cdk/aws-sns';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';

/**
 * A stack for our simple Lambda-powered web service
 */
export class TrivialStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'Topic');
    topic.grantPublish(new iam.AccountRootPrincipal());
    topic.grantPublish(new iam.AccountPrincipal('561462023695'));
  }
}

/**
 * Deployable unit of web service app
 */
export class TrivialStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new TrivialStack(this, 'TrivialStack');
  }
}