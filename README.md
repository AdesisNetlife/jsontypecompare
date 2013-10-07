JSON type comparison
===============

[![Build Status](https://api.travis-ci.org/gonzaloruizdevilla/jsontypecompare.png?branch=master)](http://travis-ci.org/gonzaloruizdevilla/jsontypecompare
)

Compare the types of JSON documents. You can try the app here: [http://adesisnetlife.github.io/jsontypecompare/dist/index.html](http://adesisnetlife.github.io/jsontypecompare/dist/index.html)


Description
--------
This is a simple AngularJS webapp that allows you to compare the types of two JSON documents.

The comparison will look at the properties of the document and compare it's types, ignoring the specific values that they may have.

When objects have other child objects, they will get compared too.

If objects are of different type, a table will be printed with the paths to the different properties and a little description of the difference.

A note about arrays
--------
When an array is found, it will analyze the types of its values. If the values of one array are of different type, the array will be marked as of type 'mixed' and it will be considered different to every other array. When the array holds object value, the properties of all objects will be analyzed and combined together to define the type of the array.

### Examples of array comparisons ###

Different arrays:

	{
		"my_arr": [1,2]
	}

	vs

	{
		"my_arr": ["1","2"]
	}

Mixed arrays, considered different between them:


	{
		"my_arr": [1,"2"]
	}

	vs

	{
		"my_arr": ["1",2]
	}

Similar arrays. Properties are combined in first array (somehow considered optional in first arrays objects):

	{
		"my_arr": [{"a": 1}, {"b": 2, "c": 3}]
	}

	vs

	{
		"my_arr": [{"a": 5, "b": 6, "c": 7}]
	}

