test:
	./node_modules/nodeunit/bin/nodeunit test/*.js
	
clean:
	rm -rf ./node_modules
	
.PHONY: test install

