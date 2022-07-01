# Introduction

Server-side classes

`database` folder is the place for the database.

# XcServerDatabase

constructor({
                databaseFileName, loadCallBack, saveCallback
              })

notifyModification()

# XcServerUser

This server requires `database/users.json` as the user database. An example of `users.json`:

```
[
	[
		"user1@user1.com",
		{
			"password": "$2a$05$mIWlwLQSR/ZmsPasXe847uri7y.54h5CQwTm4E1NBCGU5nSCoufPS",
			"profile": {
				"fullname": "",
				"gender": "male",
				"birthdate": "1990-09-01",
				"telephone": "111111",
				"address": "1111111"
			},
			"disabled": false
		}
	]
]
```
