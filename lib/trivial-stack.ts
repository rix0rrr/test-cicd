import * as sns from '@aws-cdk/aws-sns';
import { Construct, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';

/**
 * A stack for our simple Lambda-powered web service
 */
export class TrivialStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new sns.Topic(this, 'Topic');
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