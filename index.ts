process.on('SIGINT', () => {
    process.exit();
  });

  let script: string;

  if (process.env.npm_lifecycle_event === 'build') {
    script = 'build';
  } else {
    script = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }

  require(`./src/runner/${script}`);
