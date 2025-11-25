module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-env": {
          targets: {
            // 古いブラウザでも動作するよう IE11 相当まで下げる
            ie: "11",
          },
          useBuiltIns: "entry",
          corejs: 3,
        },
      },
    ],
  ],
};
