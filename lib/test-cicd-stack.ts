import * as cdk from '@aws-cdk/core';
import * as cdkp from '@aws-cdk/pipelines';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as sns from '@aws-cdk/aws-sns';

export class TestCicdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceArtifact = new cp.Artifact();
    const cloudAssemblyArtifact = new cp.Artifact();

    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,
      sourceAction: new cpa.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
        // Replace these with your actual GitHub project name
        owner: 'rix0rrr',
        repo: 'test-cicd',
      }),

      synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      }),
    });

    pipeline.addApplicationStage(new SomeStage(this, 'Steesj', {
      env: {
        account: '561462023695',
        region: 'us-east-2',
      },
    }));
  }
}

class SomeStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new SomeStack(this, 'TopicStack');
  }
}

class SomeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new sns.Topic(this, 'Topic');
  }
}