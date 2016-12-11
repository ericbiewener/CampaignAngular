
# The first crowd-sourced politician
This is a demo website built primarily in AngularJS and Ruby on Rails. It's fully responsive and compatible with iOS. It has been pretty well tested on Chrome, iPhone 5, and Netscape Navigator. I glanced at it in Firefox & Safari. Currently configured for deployment to Heroku and asset hosting and delivery through Amazon S3 and Cloudfront.

https://campaign-angular.herokuapp.com/

The following is a rough description of the features and technologies used:

##### Contributed Frameworks & Libraries

* AngularJS
* Ruby on Rails
* JavaScript Web Token authentication
* Amazon S3 & CloudFront
* jQuery
* GSAP
* ScrollMagic

##### Custom AngularJS Directives & Services

* Services for injecting JWTs into outgoing request headers and managing the client-side storage of JWT tokens and other cached session data
* Service for animated morphing of SVGs
* Service for changing the color of SVG elements, including those filled with gradients. Allows specification of color relationships with other elements to coordinate multiple-element color changes.
* Light-weight directive for zooming and panning an element
* Light-weight flash messaging service
* Light-weight directives for interaction for dragging & pinching
* Custom on-off switch and slider widgets
