#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestCicdStack } from '../lib/test-cicd-stack';

const app = new cdk.App();
new TestCicdStack(app, 'TestCicdStack', {
  env: {
    account: '355421412380',
    region: 'eu-west-1',
  },
});
