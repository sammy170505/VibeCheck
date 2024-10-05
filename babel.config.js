module.exports = function(api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: ['babel-preset-expo']
  };
};
=======
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }]
    ]
  };
};
>>>>>>> 2165e5a67d0fb087c9b92ae48c84717d84c938f4
