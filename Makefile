
#
# Default.
#

default: scan

#
# Tasks.
#

# Remove non-checked-in dependencies.
clean:
	@rm -rf node_modules

# Run the bot.
scan: node_modules
	@DEBUG=* node --harmony lib/bot

# Set env vars.
set:
	@node --harmony ./env

# Run the queue processor.
process: node_modules
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