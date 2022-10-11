#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { FileLambdaStack } from '../lib/file-lambda-stack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    region: 'eu-west-1',
    account: '355421412380',
  }
});