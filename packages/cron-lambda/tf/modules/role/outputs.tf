output "iam_role_arn" {
    description = "IAM role ARN"
    value = try(aws_iam_role.lambda_role.arn)
}