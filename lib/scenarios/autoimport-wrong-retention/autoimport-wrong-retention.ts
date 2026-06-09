import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Deploy this with AUTO_IMPORT_EXISTING_RESOURCES, but the resource already exists (create it first)
 *
 * Error: the existing resource should have policy "RETAIN" but it doesn't.
 */
export class AutoImportWrongRetention extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new cdk.CfnWaitConditionHandle(this, 'WCH');

    new iam.Role(this, 'SomeRole', {
      roleName: 'role-already-exists',
      assumedBy: new iam.AccountRootPrincipal(),
      //      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

