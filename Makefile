build:
	docker build -t bothelp .

run:
	docker run -d -p 3000:3000 --name bothelp --rm bothelp