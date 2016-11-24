# Command line paths
ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/eslint/bin/eslint.js
MOCHA = ./node_modules/.bin/_mocha
COVERALLS = ./node_modules/coveralls/bin/coveralls.js
GENERATED_FOLDER = test/generated
CLI_OUTPUT_FOLDER = $(GENERATED_FOLDER)/logs
CLI_PATH = ./lib/index.js

test: eslint test-cli test-mocha

eslint:
	# check code style
	@ $(ESLINT) -c ./.eslintrc lib

test-cli:
	mkdir -p $(CLI_OUTPUT_FOLDER)
	$(CLI_PATH) > $(CLI_OUTPUT_FOLDER)/empty.log
	$(CLI_PATH) --silent > $(CLI_OUTPUT_FOLDER)/silent.log
	$(CLI_PATH) -h > $(CLI_OUTPUT_FOLDER)/help.log
	$(CLI_PATH) -v > $(CLI_OUTPUT_FOLDER)/version.log
	$(CLI_PATH) test/tags/wrong-component.tag --check > $(CLI_OUTPUT_FOLDER)/analyzer-fail.log
	$(CLI_PATH) test/tags/component.tag --check > $(CLI_OUTPUT_FOLDER)/analyzer-ok.log
	$(CLI_PATH) test/tags > $(CLI_OUTPUT_FOLDER)/folder-no-file.log
	$(CLI_PATH) test/tags --ext foo > $(CLI_OUTPUT_FOLDER)/folder-ext.log
	$(CLI_PATH) test/tags $(GENERATED_FOLDER)/cmp.js > $(CLI_OUTPUT_FOLDER)/folder-and-file.log
	$(CLI_PATH) test/tags/component.tag $(GENERATED_FOLDER)/component.js > $(CLI_OUTPUT_FOLDER)/file-and-file.log
	$(CLI_PATH) test/tags $(GENERATED_FOLDER)/component-pug.js --ext pug --template pug --type coffee > $(CLI_OUTPUT_FOLDER)/parsers.log
	$(CLI_PATH) test/tags/export $(GENERATED_FOLDER)/export/tags.html --export html
	$(CLI_PATH) test/tags/export $(GENERATED_FOLDER)/export/tags.js --export js
	$(CLI_PATH) test/tags/export $(GENERATED_FOLDER)/export/tags.css --export css
	$(CLI_PATH) test/tags/export/ $(GENERATED_FOLDER)/export/tags.scss.css --ext html --export css --style sass

test-mocha:
	@ $(ISTANBUL) cover $(MOCHA) -- -R spec test/runner.js

test-coveralls:
	@ RIOT_COV=1 cat ./coverage/lcov.info ./coverage/report-lcov/lcov.info | $(COVERALLS)


.PHONY: test eslint test-karma test-coveralls
