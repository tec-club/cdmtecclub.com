---
title: "Random PI Approximation"
subtitle: "An explanation of how to approximate PI w/ random dots"
date: 2015-06-02
author: "Ryan Tolsma"

layout: "post"
type: "post"
backgroundImage: "res/2015-06-02--pi_matrix.jpg"
---

> _This is a guest post by Ryan Tolsma_

Recently I was experimenting with the Javascript/HTML5 Canvas element and decided to approximate the value of pi using a geometric relationship between circles and squares. When a unit circle is inscribed within a square, the area of the circle relative to the area of the square is exactly pi/4. With this knowledge, it is easy to see that the proportion of randomly selected points that remain inside the circle should be approximately pi/4. So if we were to take an extraordinarily large sample of points, and multiplied the proportion that lay within the circle, we would end up with a value very close to pi. I decided to use this concept to create a nice visual representation of the process for estimating pi.

The process of estimating pi mathematically, takes 3 steps. 1.) Plot an extremely large number of random points on a square. 2.) Take the number of points that lay within the circle in the square, and divide that by the total number of points plotted. This will give you the proportion of points in the circle, relative to the points in the square, hence it should grow closer to pi/4 as data is plotted. 3.) Multiply the previous proportion by 4, to get your approximate value of pi. 

Here is the main code used to implement this sequence:

    function run() {
        //The animate function makes this sequence of code run at 60 hertz
        //The precision variable dictates how many points are plotted per callback
        animate(run);
        for (var i = 0; i < precision; i++) {
          var xvar = Math.random() * width,
              yvar = Math.random() * height;
          var dot = new Circle(xvar, yvar, 1);
          if (Math.pow(xvar, 2) + Math.pow(yvar, 2) <= Math.pow(circle.radius, 2))
            probabilityCounter++;
        }
        /*
         I'm only drawing the last dot of the loop because if i did every dot, the canvas would fill to quickly. 60 dots are drawn per second
         */
        drawCircle(dot);
        //#math
        average = (((averageCounter) * average) + (probabilityCounter / precision)) / (averageCounter + 1);
        averageCounter++;
        pi = 4 * average * area / (Math.pow(circle.radius, 2));
        //Below code, just displays the values of pi and other mathy variables
        //clear the display for the current value of pi
        //add a container rect for the value of pi
        //display the value for pi
        textWindow.innerHTML = "Pi is: " + pi;
        document.getElementById("samples").innerHTML = "# of Samples: " + averageCounter + " #of Trials: " + averageCounter * precision;
        console.log("pi/true mean: ", pi + " ", "average%: ", pi / 4 + " ", "samples: ", averageCounter + " ", "Number of success: ", probabilityCounter);
        //reset probabilityCounter
        probabilityCounter = 0;
    }
    run();

Alright then, so I added some comments into the code to help indicate what is going on, but let me explain further. The first for-loop, generates random points and compares their values to see if they lay within the circle. If they do, the “probabilityCounter” variable counts it, and the loop continues until it finishes execution, namely after 'precision' number of times. Then, to calculate the proportion of points within the circle, you only to divide “probabilityCounter” by the variable “precision”.

After the for-loop, a few lines of math appear. I have a variable named “average” to store the total average proportion of points within the circle, and a variable named “averageCounter” to store the number of execution callbacks. In order to calculate the new average, I multiplied the “averageVariable” by “averageCounter” to find the previous total, and then added the newly calculated proportion “probabilityCounter/precision” and divided that by “averageCounter+1” to finish calculating the new proportion. To find pi out of the “average” variable uses the formula pi*r^2, this algebra is conducted above in one line of code. The rest of the code merely involves displaying the data. And that's it, hope you enjoyed understanding this as much as I did!