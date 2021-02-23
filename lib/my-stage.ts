import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { ContainerLambdaStack } from './container-lambda-stack';
import { FileLambdaStack } from './file-lambda-stack';

/**
 * Deployable unit of web service app
 */
export class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new ContainerLambdaStack(this, 'ContainerLambda');
  }
}