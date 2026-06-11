import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

/**
 * Creates a circular dependency between two security groups.
 *
 * Security Group A has an ingress rule referencing Security Group B,
 * and Security Group B has an ingress rule referencing Security Group A.
 * With explicit DependsOn in both directions, CloudFormation cannot determine
 * a valid creation order.
 */
export class CircularDependencies extends Construct {
  constructor(scope: Construct, id: string, props: { vpc: ec2.IVpc }) {
    super(scope, id);

    const sgA = new ec2.CfnSecurityGroup(this, 'SecurityGroupA', {
      groupDescription: 'Security Group A',
      vpcId: props.vpc.vpcId,
    });

    const sgB = new ec2.CfnSecurityGroup(this, 'SecurityGroupB', {
      groupDescription: 'Security Group B',
      vpcId: props.vpc.vpcId,
      // Ingress rule referencing SG A creates an implicit dependency B -> A
      securityGroupIngress: [{
        ipProtocol: 'tcp',
        fromPort: 443,
        toPort: 443,
        sourceSecurityGroupId: sgA.attrGroupId,
      }],
    });

    // Add ingress to A referencing B, plus force an explicit DependsOn A -> B
    // This creates the cycle: A -> B (explicit DependsOn) and B -> A (Ref in ingress)
    sgA.securityGroupIngress = [{
      ipProtocol: 'tcp',
      fromPort: 80,
      toPort: 80,
      sourceSecurityGroupId: sgB.attrGroupId,
    }];
    sgA.addDependency(sgB);
  }
}
