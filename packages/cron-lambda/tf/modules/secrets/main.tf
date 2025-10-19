resource "aws_ssm_parameter" "lambda_secrets" {
    name = "/visuai/cron-lambda/secret"
    description = "All secrets required for Lambda to function"
    type = "SecureString"
    value = var.lambda_secrets
}