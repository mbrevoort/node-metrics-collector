test:
	./node_modules/nodeunit/bin/nodeunit test/*.js
	
install:
	npm --registry http://npm.petdev.com:9000/  install  --registry http://npm.petdev.com:9000/ . && npm update
	
npm-publish:
	npm --registry http://npm.petdev.com:5984/ publish .
	
clean:
	rm -rf ./node_modules
	
.PHONY: test install

