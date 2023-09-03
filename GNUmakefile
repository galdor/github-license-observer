ICON_SIZES = 48 96
SRC_DIR = src

define build_icon
inkscape --export-filename $1 \
         --export-type png \
         --export-background "#000000" \
         --export-background-opacity 0.0 \
         -w $2 -h $2 \
         icon.svg
endef

define build_icons
$(foreach size,$(ICON_SIZES),$(call build_icon,src/icon-$(size).png,$(size))
)
endef

all: build

build: icons
	web-ext build -s $(SRC_DIR) -a . --overwrite-dest

icons:
	$(call build_icons)

check:
	web-ext lint -s $(SRC_DIR)

.PHONY: build icons check
