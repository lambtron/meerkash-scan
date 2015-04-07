
#
# Default.
#

default: run

#
# Tasks.
#

# Remove non-checked-in dependencies.
clean:
	@rm -rf node_modules

# Run the bot in debug mode.
debug: node_modules
	@DEBUG=* node --harmony lib/bot

# Run the bot.
run: node_modules
	@node --harmony lib/bot

# Set env vars.
set:
	@node --harmony ./env

queue: node_modules
	@DEBUG=* node --harmony lib/queue

#
# Targets.
#

node_modules: package.json
	@npm install
	@touch node_modules

#
# Phonies.
#

.PHONY: clean
.PHONY: debug
.PHONY: run