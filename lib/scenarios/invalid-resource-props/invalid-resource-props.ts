import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib/core';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * A resource with invalid properties. Should be caught by early validation.
 */
export class InvalidResourceProps extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const q = new sqs.Queue(this, 'SomeQueue', {
    });
    const l1 = q.node.defaultChild as cdk.CfnResource;

    // Break this property on purpose (schematically should be a number, passing a string here)
    l1.addPropertyOverride('MessageRetentionPeriod', 'asdf');
  }
}


