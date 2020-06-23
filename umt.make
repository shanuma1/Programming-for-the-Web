#this file is in the root of the course
HOME_DIR =	$(patsubst %/,%, $(dir $(firstword $(MAKEFILE_LIST))))

TEMPLATE_DIR =  $(HOME_DIR)/assets/umt

UMT_FILES = $(wildcard ./*.umt)
UMT_BASES = $(subst .umt,,$(UMT_FILES))
HTML_FILES = $(subst .umt,.html,$(UMT_FILES)) 

#if we have an index.umt, generate only html, else both html + pdf
ifeq (./index.umt,$(wildcard ./index.umt))
  TARGETS = $(HTML_FILES)
else
  PDF_FILES = $(subst .umt,.pdf,$(UMT_FILES)) 
  TARGETS = $(PDF_FILES) $(HTML_FILES) 
endif


all:		$(TARGETS)

.phony:		clean

clean:
		rm -rf *~ $(UMT_BASES) $(TARGETS)

%.html:		%.umt
		umt -D HOME=$(HOME_DIR) \
		  $(TEMPLATE_DIR)/article-template.html $< $@

%.pdf:		%.umt
		umt -D HOME=$(HOME_DIR) \
		  $(TEMPLATE_DIR)/article-template.tex $< $@

%.tex:		%.umt
		umt -D HOME=$(HOME_DIR) \
		  $(TEMPLATE_DIR)/article-template.tex $< $@
