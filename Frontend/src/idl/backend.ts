/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/backend.json`.
 */
export type Backend = {
    "address": "ARGG2aicTyGMdnv1kJvR6XurXBicAq3b8qYALq4WMCMK",
    "metadata": {
      "name": "backend",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "close",
        "discriminator": [
          98,
          165,
          201,
          177,
          108,
          65,
          206,
          96
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true,
            "relations": [
              "vaultState"
            ]
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "vaultState",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "deposit",
        "discriminator": [
          242,
          35,
          198,
          137,
          82,
          225,
          242,
          182
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true,
            "relations": [
              "vaultState"
            ]
          },
          {
            "name": "vaultState",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "vaultState",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "vault",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "lockDuration",
            "type": "i64"
          }
        ]
      },
      {
        "name": "withdraw",
        "discriminator": [
          183,
          18,
          70,
          156,
          148,
          109,
          161,
          34
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true,
            "relations": [
              "vaultState"
            ]
          },
          {
            "name": "vaultState",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "vaultState",
        "discriminator": [
          228,
          196,
          82,
          165,
          98,
          210,
          235,
          152
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "customError",
        "msg": "Custom error message"
      },
      {
        "code": 6001,
        "name": "vaultLocked",
        "msg": "Vault is still locked"
      },
      {
        "code": 6002,
        "name": "invalidLockDuration",
        "msg": "Lock duration must be greater than zero"
      },
      {
        "code": 6003,
        "name": "lockDurationOverflow",
        "msg": "Lock duration overflowed"
      }
    ],
    "types": [
      {
        "name": "vaultState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "user",
              "type": "pubkey"
            },
            {
              "name": "createdAt",
              "type": "i64"
            },
            {
              "name": "vaultBump",
              "type": "u8"
            },
            {
              "name": "stateBump",
              "type": "u8"
            },
            {
              "name": "lockUntil",
              "type": "i64"
            }
          ]
        }
      }
    ],
    "constants": [
      {
        "name": "seed",
        "type": "string",
        "value": "\"anchor\""
      }
    ]
  };
  