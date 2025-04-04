export const expectedGroupedGraph = {
  "/test/main.js": {
    variables: {
      result: {
        file: "/test/main.js",
        varName: "result",
        originalDefinition: "const result = helper();",
        position: {
          line: 4,
          column: 10
        },
        usages: [
          {
            code: "result",
            fullLine: "console.log(result);",
            file: "/test/main.js",
            position: {
              line: 7,
              column: 16
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      },
      res: {
        file: "/test/main.js",
        varName: "res",
        originalDefinition: "const { res } = resultObj;",
        position: {
          line: 5,
          column: 10
        },
        usages: [
          {
            code: "res",
            fullLine: "const username = res.username;",
            file: "/test/main.js",
            position: {
              line: 8,
              column: 21
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "username",
                  fullLine: "console.log(\"username\", username);",
                  file: "/test/main.js",
                  position: {
                    line: 10,
                    column: 28
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  }
                }
              ]
            ]
          },
          {
            code: "res",
            fullLine: "const fullname = res.fullname;",
            file: "/test/main.js",
            position: {
              line: 9,
              column: 21
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "fullname",
                  fullLine: "console.log(\"fullname\", fullname);",
                  file: "/test/main.js",
                  position: {
                    line: 11,
                    column: 28
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  }
                }
              ]
            ]
          }
        ],
        transformations: [],
        derivedFrom: "resultObj"
      },
      username: {
        file: "/test/main.js",
        varName: "username",
        originalDefinition: "const username = res.username;",
        position: {
          line: 8,
          column: 10
        },
        usages: [
          {
            code: "username",
            fullLine: "console.log(\"username\", username);",
            file: "/test/main.js",
            position: {
              line: 10,
              column: 28
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      },
      fullname: {
        file: "/test/main.js",
        varName: "fullname",
        originalDefinition: "const fullname = res.fullname;",
        position: {
          line: 9,
          column: 10
        },
        usages: [
          {
            code: "fullname",
            fullLine: "console.log(\"fullname\", fullname);",
            file: "/test/main.js",
            position: {
              line: 11,
              column: 28
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      }
    },
    imports: {
      helper: {
        file: "/test/main.js",
        varName: "helper",
        originalDefinition: "import { helper } from './helper.js';",
        position: {
          line: 2,
          column: 4
        },
        usages: [
          {
            code: "helper",
            fullLine: "const result = helper();",
            file: "/test/main.js",
            position: {
              line: 4,
              column: 19
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "result",
                  fullLine: "console.log(result);",
                  file: "/test/main.js",
                  position: {
                    line: 7,
                    column: 16
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  }
                }
              ]
            ]
          },
          {
            code: "helper",
            fullLine: "export function helper() {",
            file: "/test/helper.js",
            position: {
              line: 3,
              column: 4
            },
            type: "exported_usage",
            details: {
              context: "import"
            }
          }
        ],
        transformations: [],
        importType: "import",
        importName: "helper",
        importedFrom: "./helper.js",
        importedFromFile: "/test/helper.js"
      },
      resultObj: {
        file: "/test/main.js",
        varName: "resultObj",
        originalDefinition: "import { resultObj } from './helper.js';",
        position: {
          line: 3,
          column: 4
        },
        usages: [
          {
            code: "resultObj",
            fullLine: "const { res } = resultObj;",
            file: "/test/main.js",
            position: {
              line: 5,
              column: 20
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "res",
                  fullLine: "const username = res.username;",
                  file: "/test/main.js",
                  position: {
                    line: 8,
                    column: 21
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  },
                  nestedUsages: [
                    [
                      {
                        code: "username",
                        fullLine: "console.log(\"username\", username);",
                        file: "/test/main.js",
                        position: {
                          line: 10,
                          column: 28
                        },
                        type: "usage",
                        details: {
                          context: "expression"
                        }
                      }
                    ]
                  ]
                },
                {
                  code: "res",
                  fullLine: "const fullname = res.fullname;",
                  file: "/test/main.js",
                  position: {
                    line: 9,
                    column: 21
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  },
                  nestedUsages: [
                    [
                      {
                        code: "fullname",
                        fullLine: "console.log(\"fullname\", fullname);",
                        file: "/test/main.js",
                        position: {
                          line: 11,
                          column: 28
                        },
                        type: "usage",
                        details: {
                          context: "expression"
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          },
          {
            code: "resultObj",
            fullLine: "export const resultObj = getProfile();",
            file: "/test/helper.js",
            position: {
              line: 7,
              column: 4
            },
            type: "exported_usage",
            details: {
              context: "import"
            }
          }
        ],
        transformations: [],
        importType: "import",
        importName: "resultObj",
        importedFrom: "./helper.js",
        importedFromFile: "/test/helper.js"
      }
    },
    exports: {
      test: {
        file: "/test/main.js",
        varName: "test",
        originalDefinition: "export const test = \"Victor\";",
        position: {
          line: 6,
          column: 4
        },
        usages: [],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "test",
        exportedFromFile: "/test/main.js"
      }
    }
  },
  "/test/helper.js": {
    variables: {
      res: {
        file: "/test/helper.js",
        varName: "res",
        originalDefinition: "const { res } = resultObj;",
        position: {
          line: 8,
          column: 10
        },
        usages: [
          {
            code: "res",
            fullLine: "const username = res.username;",
            file: "/test/helper.js",
            position: {
              line: 11,
              column: 21
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "username",
                  fullLine: "console.log(\"username\", username);",
                  file: "/test/helper.js",
                  position: {
                    line: 13,
                    column: 28
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  }
                }
              ]
            ]
          },
          {
            code: "res",
            fullLine: "const fullname = res.fullname;",
            file: "/test/helper.js",
            position: {
              line: 12,
              column: 21
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "fullname",
                  fullLine: "console.log(\"fullname\", fullname);",
                  file: "/test/helper.js",
                  position: {
                    line: 14,
                    column: 28
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  }
                }
              ]
            ]
          }
        ],
        transformations: [],
        derivedFrom: "resultObj"
      },
      username: {
        file: "/test/helper.js",
        varName: "username",
        originalDefinition: "const username = res.username;",
        position: {
          line: 11,
          column: 10
        },
        usages: [
          {
            code: "username",
            fullLine: "console.log(\"username\", username);",
            file: "/test/helper.js",
            position: {
              line: 13,
              column: 28
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      },
      fullname: {
        file: "/test/helper.js",
        varName: "fullname",
        originalDefinition: "const fullname = res.fullname;",
        position: {
          line: 12,
          column: 10
        },
        usages: [
          {
            code: "fullname",
            fullLine: "console.log(\"fullname\", fullname);",
            file: "/test/helper.js",
            position: {
              line: 14,
              column: 28
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      }
    },
    imports: {
      getProfile: {
        file: "/test/helper.js",
        varName: "getProfile",
        originalDefinition: "import {getProfile} from './profile.js';",
        position: {
          line: 2,
          column: 4
        },
        usages: [
          {
            code: "getProfile",
            fullLine: "export const resultObj = getProfile();",
            file: "/test/helper.js",
            position: {
              line: 7,
              column: 29
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              [
                {
                  code: "resultObj",
                  fullLine: "import { resultObj } from './helper.js';",
                  file: "/test/main.js",
                  position: {
                    line: 3,
                    column: 4
                  },
                  type: "imported_usage",
                  details: {
                    context: "expression"
                  }
                },
                {
                  code: "resultObj",
                  fullLine: "const { res } = resultObj;",
                  file: "/test/main.js",
                  position: {
                    line: 5,
                    column: 20
                  },
                  type: "usage",
                  details: {
                    context: "expression"
                  },
                  nestedUsages: [
                    {
                      code: "res",
                      fullLine: "const username = res.username;",
                      file: "/test/main.js",
                      position: {
                        line: 8,
                        column: 21
                      },
                      type: "usage",
                      details: {
                        context: "expression"
                      },
                      nestedUsages: [
                        {
                          code: "username",
                          fullLine: "console.log(\"username\", username);",
                          file: "/test/main.js",
                          position: {
                            line: 10,
                            column: 28
                          },
                          type: "usage",
                          details: {
                            context: "expression"
                          }
                        }
                      ]
                    },
                    {
                      code: "res",
                      fullLine: "const fullname = res.fullname;",
                      file: "/test/main.js",
                      position: {
                        line: 9,
                        column: 21
                      },
                      type: "usage",
                      details: {
                        context: "expression"
                      },
                      nestedUsages: [
                        {
                          code: "fullname",
                          fullLine: "console.log(\"fullname\", fullname);",
                          file: "/test/main.js",
                          position: {
                            line: 11,
                            column: 28
                          },
                          type: "usage",
                          details: {
                            context: "expression"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            ]
          },
          {
            code: "getProfile",
            fullLine: "export {getProfile};",
            file: "/test/profile.js",
            position: {
              line: 4,
              column: 4
            },
            type: "exported_usage",
            details: {
              context: "import"
            }
          }
        ],
        transformations: [],
        importType: "import",
        importName: "getProfile",
        importedFrom: "./profile.js",
        importedFromFile: "/test/profile.js"
      }
    },
    exports: {
      helper: {
        file: "/test/helper.js",
        varName: "helper",
        originalDefinition: "export function helper() {",
        position: {
          line: 3,
          column: 4
        },
        usages: [
          {
            code: "helper",
            fullLine: "import { helper } from './helper.js';",
            file: "/test/main.js",
            position: {
              line: 2,
              column: 4
            },
            type: "imported_usage",
            details: {
              context: "expression"
            }
          },
          {
            code: "helper",
            fullLine: "const result = helper();",
            file: "/test/main.js",
            position: {
              line: 4,
              column: 19
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              {
                code: "result",
                fullLine: "console.log(result);",
                file: "/test/main.js",
                position: {
                  line: 7,
                  column: 16
                },
                type: "usage",
                details: {
                  context: "expression"
                }
              }
            ]
          }
        ],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "helper",
        exportedFromFile: "/test/helper.js"
      },
      resultObj: {
        file: "/test/helper.js",
        varName: "resultObj",
        originalDefinition: "export const resultObj = getProfile();",
        position: {
          line: 7,
          column: 4
        },
        usages: [
          {
            code: "resultObj",
            fullLine: "import { resultObj } from './helper.js';",
            file: "/test/main.js",
            position: {
              line: 3,
              column: 4
            },
            type: "imported_usage",
            details: {
              context: "expression"
            }
          },
          {
            code: "resultObj",
            fullLine: "const { res } = resultObj;",
            file: "/test/main.js",
            position: {
              line: 5,
              column: 20
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              {
                code: "res",
                fullLine: "const username = res.username;",
                file: "/test/main.js",
                position: {
                  line: 8,
                  column: 21
                },
                type: "usage",
                details: {
                  context: "expression"
                },
                nestedUsages: [
                  {
                    code: "username",
                    fullLine: "console.log(\"username\", username);",
                    file: "/test/main.js",
                    position: {
                      line: 10,
                      column: 28
                    },
                    type: "usage",
                    details: {
                      context: "expression"
                    }
                  }
                ]
              },
              {
                code: "res",
                fullLine: "const fullname = res.fullname;",
                file: "/test/main.js",
                position: {
                  line: 9,
                  column: 21
                },
                type: "usage",
                details: {
                  context: "expression"
                },
                nestedUsages: [
                  {
                    code: "fullname",
                    fullLine: "console.log(\"fullname\", fullname);",
                    file: "/test/main.js",
                    position: {
                      line: 11,
                      column: 28
                    },
                    type: "usage",
                    details: {
                      context: "expression"
                    }
                  }
                ]
              }
            ]
          }
        ],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "resultObj",
        exportedFromFile: "/test/helper.js"
      },
      test: {
        file: "/test/helper.js",
        varName: "test",
        originalDefinition: "export const test = \"Victor\";",
        position: {
          line: 9,
          column: 4
        },
        usages: [],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "test",
        exportedFromFile: "/test/helper.js"
      }
    }
  },
  "/test/profile.js": {
    variables: {},
    imports: {
      getProfile: {
        file: "/test/profile.js",
        varName: "getProfile",
        originalDefinition: "import {getProfile} from 'profile-lib';",
        position: {
          line: 2,
          column: 4
        },
        usages: [],
        transformations: [],
        importType: "import",
        importName: "getProfile",
        importedFrom: "profile-lib",
        importedFromFile: "profile-lib"
      }
    },
    exports: {
      getProfile: {
        file: "/test/profile.js",
        varName: "getProfile",
        originalDefinition: "export {getProfile};",
        position: {
          line: 4,
          column: 4
        },
        usages: [
          {
            code: "getProfile",
            fullLine: "import {getProfile} from './profile.js';",
            file: "/test/helper.js",
            position: {
              line: 2,
              column: 4
            },
            type: "imported_usage",
            details: {
              context: "expression"
            }
          },
          {
            code: "getProfile",
            fullLine: "export const resultObj = getProfile();",
            file: "/test/helper.js",
            position: {
              line: 7,
              column: 29
            },
            type: "usage",
            details: {
              context: "expression"
            },
            nestedUsages: [
              {
                code: "resultObj",
                fullLine: "import { resultObj } from './helper.js';",
                file: "/test/main.js",
                position: {
                  line: 3,
                  column: 4
                },
                type: "imported_usage",
                details: {
                  context: "expression"
                }
              },
              {
                code: "resultObj",
                fullLine: "const { res } = resultObj;",
                file: "/test/main.js",
                position: {
                  line: 5,
                  column: 20
                },
                type: "usage",
                details: {
                  context: "expression"
                },
                nestedUsages: [
                  {
                    code: "res",
                    fullLine: "const username = res.username;",
                    file: "/test/main.js",
                    position: {
                      line: 8,
                      column: 21
                    },
                    type: "usage",
                    details: {
                      context: "expression"
                    },
                    nestedUsages: [
                      {
                        code: "username",
                        fullLine: "console.log(\"username\", username);",
                        file: "/test/main.js",
                        position: {
                          line: 10,
                          column: 28
                        },
                        type: "usage",
                        details: {
                          context: "expression"
                        }
                      }
                    ]
                  },
                  {
                    code: "res",
                    fullLine: "const fullname = res.fullname;",
                    file: "/test/main.js",
                    position: {
                      line: 9,
                      column: 21
                    },
                    type: "usage",
                    details: {
                      context: "expression"
                    },
                    nestedUsages: [
                      {
                        code: "fullname",
                        fullLine: "console.log(\"fullname\", fullname);",
                        file: "/test/main.js",
                        position: {
                          line: 11,
                          column: 28
                        },
                        type: "usage",
                        details: {
                          context: "expression"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "getProfile",
        exportedFromFile: "/test/profile.js"
      }
    }
  }
};