import { Construct } from 'constructs';
import { Stage, StageProps } from 'aws-cdk-lib';
import { ContainerLambdaStack } from './container-lambda-stack';
import { FileLambdaStack } from './file-lambda-stack';

/**
 * Deployable unit of web service app
 */
export class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new ContainerLambdaStack(this, 'ContainerLambda');
    new FileLambdaStack(this, 'FileLambda');
  }
}