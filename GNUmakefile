SRC_DIR = src

all: build

build:
	web-ext build -s $(SRC_DIR) -a . --overwrite-dest

check:
	web-ext lint -s $(SRC_DIR)

.PHONY: build check
