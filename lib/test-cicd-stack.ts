import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';

export class TestCicdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'SomeQueue');
  }
}

export class TestCicdStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new TestCicdStack(this, 'TestCiCdStack');
  }
}
