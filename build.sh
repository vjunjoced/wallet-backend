#!/bin/bash
#!/usr/local/bin/npm
NAME_IMG=wallet-backend
VERSION=1.0.0

npm run build
docker image build -t ${NAME_IMG} .