data "archive_file" "lambda_binary" {
  type = "zip"
  source_file = "${path.module}/../../../bundle/index.mjs"
  output_path = "${path.module}/../../../bundle/bundle.zip"
}

resource "aws_lambda_function" "this" {
  filename = data.archive_file.lambda_binary.output_path
  source_code_hash = data.archive_file.lambda_binary.output_base64sha256
  handler = "index.handler"
  function_name = "image-cron-worker"
  role = var.iam_role_arn
  timeout = 1
  memory_size = 512
  runtime = "nodejs22.x"
}