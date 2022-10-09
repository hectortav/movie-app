#!/bin/bash

# retry migration until postgres is up
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"/..

for i in {1..5}; do
    if  ./node_modules/.bin/prisma migrate deploy; then
        echo "🐘"
        break
    fi
    sleep 5
done
