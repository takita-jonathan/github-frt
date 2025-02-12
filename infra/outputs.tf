output "website_url" {
  value = aws_s3_bucket.github-frt.website_endpoint
}

output "bucket_name" {
  value = aws_s3_bucket.github-frt.bucket
}
