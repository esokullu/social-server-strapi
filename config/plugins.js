module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET'),
          },
        },
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64
        },
      },
    },
  });
   