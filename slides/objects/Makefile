DOC =		objects

HOME_DIR =	../..

TEMPLATE_DIR =  $(HOME_DIR)/assets/umt

TARGETS = 	$(DOC).html $(DOC).pdf

all:		$(TARGETS)

.PHONY:		clean

clean:
		rm -rf *~ $(DOC) $(TARGETS) *.toc *.snm *.nav

%.html:		%.umt
		umt -D HOME=$(HOME_DIR) -D umt/code/lang=js -d slides \
		  $(TEMPLATE_DIR)/slides-template.html $< $@

%.pdf:		%.umt
		umt -D HOME=$(HOME_DIR) -D umt/code/lang=js -d slides \
		  $(TEMPLATE_DIR)/slides-template.tex $< $@
