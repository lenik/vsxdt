# Development helpers (GNU make).
#
# Regenerate changelog (pretty Markdown from git history):
#   make changelog
# Optional:
#   LOG2MD_MAX=500 make changelog

LOG2MD         ?= ./scripts/log2md
CHANGELOG      ?= changelog.md

.PHONY: changelog

changelog:
	@test -x $(LOG2MD) || chmod +x $(LOG2MD)
	@$(LOG2MD) $(CHANGELOG)
	@echo "Wrote $(CHANGELOG)"
