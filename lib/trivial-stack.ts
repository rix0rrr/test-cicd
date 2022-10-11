import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { FileLambdaStack } from './file-lambda-stack';

/**
 * A stack for our simple Lambda-powered web service
 */
export class TrivialStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });

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
    new FileLambdaStack(this, 'Filezzz');
  }
}