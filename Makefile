
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

examples:
	git checkout -B gh-pages
	git merge master --no-edit
	make -B
	git add build -f
	-git commit -m "Update examples."
	git push -f origin gh-pages
	git checkout master

.PHONY: clean examples
