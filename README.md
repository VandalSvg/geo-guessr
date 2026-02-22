# Geo Classifier

<img src="./public/Sample.png" width = 800px>
</img>

## Overview and development
How do those GeoGuessr pros guess so well? We don’t know, but we wanted to develop a GeoGuessr pro of our own! Our second, perhaps ambitious goal, was to beat these wizards at their own game. Would our model be able to classify a patch of grass as “clearly Chilean grass?”

How did we go about it? We used [this](https://www.kaggle.com/datasets/ubitquitin/geolocation-geoguessr-images-50k) public dataset of GeoGuessr street view locations categorized by country along with OpenAI’s CLIP to process the visual data and train various classifier on top of these CLIP embeddings. CLIP encodes important features like architectural and road style, vegetation types, and climate. Our first classifier with multinomial logistic regression. There seemed to be a lot of overfitting with this model, certainly not helped by the class imbalance, as some countries had thousands of images while others had a handful. But it’s worth noting that we removed countries with less than 30 images, as we suspected the model would never classify those images correctly. Perhaps we should have removed more countries. To avoid overfitting, we used a Support Vector Machine with a modest regularization parameter, and we saw increased F1 accuracy gains from this (accuracy 66%, f1 macro 0.4, f1 weighted 0.63). We had to tune the hyperparameter for regularization through grid search to find a near-optimal value. 

After training our model, we used Python & FastAPI for our backend and Next.js for our frontend in order to develop a clean interface to upload your own street view photo and have our model take a stab at the location.
## How to use this application

In Geo Classifier, the user uploads an image of a street view location of their choice, which gets displayed on the screen, until you press “Predict Country,” in which your image will get sent to our model and the top 5 predictions (along with the confidence levels) for the country will be displayed.


### Disclaimers and notes

Note: The use of bots is not permitted on competitive GeoGuessr games. 

Image credits: https://picryl.com/media/manuscript-painting-of-heezen-tharp-world-ocean-floor-map-by-berann




