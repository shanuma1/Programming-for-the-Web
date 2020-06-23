HOME_DIR =	../..

TEMPLATE_DIR =  $(HOME_DIR)/assets/umt

DOC1 =		academic-honesty-policy
DOC2 =		academic-honesty-statement

TARGETS = 	$(DOC1).html $(DOC1).pdf $(DOC2).html $(DOC2).pdf

all:		$(TARGETS)

.PHONY:		clean

clean:
		rm -rf *~  $(TARGETS) *.toc *.snm *.nav

%.html:		%.umt
		umt -D HOME=$(HOME_DIR) \
		  $(TEMPLATE_DIR)/article-template.html $< $@

%.pdf:		%.umt
		umt -D HOME=$(HOME_DIR)  \
		  $(TEMPLATE_DIR)/article-template.tex $< $@
