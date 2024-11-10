from fastapi import FastAPI, File, UploadFile, HTTPException
import requests
import json
import numpy as np
from PIL import Image
import io
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# List of class labels
index_to_class = {
    0: 'American_Crow',
    1: 'American_Goldfinch',
    2: 'American_Pipit',
    3: 'American_Redstart',
    4: 'Anna_Hummingbird',
    5: 'Baltimore_Oriole',
    6: 'Barn_Swallow',
    7: 'Bay_breasted_Warbler',
    8: 'Belted_Kingfisher',
    9: 'Bewick_Wren',
    10: 'Black_Tern',
    11: 'Black_and_white_Warbler',
    12: 'Black_billed_Cuckoo',
    13: 'Black_footed_Albatross',
    14: 'Black_throated_Sparrow',
    15: 'Blue_Grosbeak',
    16: 'Blue_Jay',
    17: 'Blue_headed_Vireo',
    18: 'Blue_winged_Warbler',
    19: 'Boat_tailed_Grackle',
    20: 'Bobolink',
    21: 'Bohemian_Waxwing',
    22: 'Bronzed_Cowbird',
    23: 'Brown_Pelican',
    24: 'Cactus_Wren',
    25: 'California_Gull',
    26: 'Canada_Warbler',
    27: 'Cape_Glossy_Starling',
    28: 'Cape_May_Warbler',
    29: 'Carolina_Wren',
    30: 'Caspian_Tern',
    31: 'Cedar_Waxwing',
    32: 'Cerulean_Warbler',
    33: 'Chestnut_sided_Warbler',
    34: 'Chipping_Sparrow',
    35: 'Clark_Nutcracker',
    36: 'Cliff_Swallow',
    37: 'Common_Tern',
    38: 'Common_Yellowthroat',
    39: 'Dark_eyed_Junco',
    40: 'Downy_Woodpecker',
    41: 'Eared_Grebe',
    42: 'Eastern_Towhee',
    43: 'Elegant_Tern',
    44: 'European_Goldfinch',
    45: 'Evening_Grosbeak',
    46: 'Fish_Crow',
    47: 'Florida_Jay',
    48: 'Forsters_Tern',
    49: 'Fox_Sparrow',
    50: 'Frigatebird',
    51: 'Gadwall',
    52: 'Geococcyx',
    53: 'Grasshopper_Sparrow',
    54: 'Great_Crested_Flycatcher',
    55: 'Great_Grey_Shrike',
    56: 'Green_Kingfisher',
    57: 'Green_Violetear',
    58: 'Green_tailed_Towhee',
    59: 'Groove_billed_Ani',
    60: 'Harris_Sparrow',
    61: 'Heermann_Gull',
    62: 'Henslow_Sparrow',
    63: 'Herring_Gull',
    64: 'Hooded_Merganser',
    65: 'Hooded_Oriole',
    66: 'Hooded_Warbler',
    67: 'Horned_Grebe',
    68: 'Horned_Lark',
    69: 'Horned_Puffin',
    70: 'House_Sparrow',
    71: 'Indigo_Bunting',
    72: 'Ivory_Gull',
    73: 'Laysan_Albatross',
    74: 'Least_Tern',
    75: 'Loggerhead_Shrike',
    76: 'Long_tailed_Jaeger',
    77: 'Louisiana_Waterthrush',
    78: 'Mallard',
    79: 'Marsh_Wren',
    80: 'Mockingbird',
    81: 'Mourning_Warbler',
    82: 'Myrtle_Warbler',
    83: 'Nashville_Warbler',
    84: 'Nighthawk',
    85: 'Northern_Flicker',
    86: 'Northern_Fulmar',
    87: 'Northern_Waterthrush',
    88: 'Olive_sided_Flycatcher',
    89: 'Orange_crowned_Warbler',
    90: 'Ovenbird',
    91: 'Pacific_Loon',
    92: 'Palm_Warbler',
    93: 'Pelagic_Cormorant',
    94: 'Pied_Kingfisher',
    95: 'Pied_billed_Grebe',
    96: 'Pileated_Woodpecker',
    97: 'Pine_Grosbeak',
    98: 'Pine_Warbler',
    99: 'Pomarine_Jaeger',
    100: 'Prairie_Warbler',
    101: 'Prothonotary_Warbler',
    102: 'Purple_Finch',
    103: 'Red_bellied_Woodpecker',
    104: 'Red_breasted_Merganser',
    105: 'Red_eyed_Vireo',
    106: 'Red_headed_Woodpecker',
    107: 'Red_winged_Blackbird',
    108: 'Ring_billed_Gull',
    109: 'Ringed_Kingfisher',
    110: 'Rock_Wren',
    111: 'Rose_breasted_Grosbeak',
    112: 'Ruby_throated_Hummingbird',
    113: 'Rufous_Hummingbird',
    114: 'Rusty_Blackbird',
    115: 'Sage_Thrasher',
    116: 'Savannah_Sparrow',
    117: 'Sayornis',
    118: 'Scarlet_Tanager',
    119: 'Scissor_tailed_Flycatcher',
    120: 'Scott_Oriole',
    121: 'Seaside_Sparrow',
    122: 'Shiny_Cowbird',
    123: 'Song_Sparrow',
    124: 'Summer_Tanager',
    125: 'Tree_Sparrow',
    126: 'Tree_Swallow',
    127: 'Tropical_Kingbird',
    128: 'Vermilion_Flycatcher',
    129: 'Vesper_Sparrow',
    130: 'Warbling_Vireo',
    131: 'Western_Grebe',
    132: 'Western_Gull',
    133: 'Western_Meadowlark',
    134: 'Western_Wood_Pewee',
    135: 'White_breasted_Kingfisher',
    136: 'White_breasted_Nuthatch',
    137: 'White_crowned_Sparrow',
    138: 'White_eyed_Vireo',
    139: 'White_necked_Raven',
    140: 'White_throated_Sparrow',
    141: 'Wilson_Warbler',
    142: 'Winter_Wren',
    143: 'Yellow_Warbler',
    144: 'Acadian_Flycatcher',
    145: 'Bank_Swallow',
    146: 'Black_throated_Blue_Warbler',
    147: 'Brandt_Cormorant',
    148: 'Brewer_Blackbird',
    149: 'Brewer_Sparrow',
    150: 'Brown_Creeper',
    151: 'Brown_Thrasher',
    152: 'Clay_colored_Sparrow',
    153: 'Common_Raven',
    154: 'Field_Sparrow',
    155: 'Glaucous_winged_Gull',
    156: 'Golden_winged_Warbler',
    157: 'Gray_Catbird',
    158: 'Gray_Kingbird',
    159: 'Gray_crowned_Rosy_Finch',
    160: 'House_Wren',
    161: 'Kentucky_Warbler',
    162: 'Le_Conte_Sparrow',
    163: 'Least_Flycatcher',
    164: 'Lincoln_Sparrow',
    165: 'Magnolia_Warbler',
    166: 'Nelson_Sharp_tailed_Sparrow',
    167: 'Orchard_Oriole',
    168: 'Philadelphia_Vireo',
    169: 'Tennessee_Warbler',
    170: 'Worm_eating_Warbler',
    171: 'Yellow_bellied_Flycatcher',
    172: 'Yellow_billed_Cuckoo',
    173: 'Yellow_breasted_Chat',
    174: 'Yellow_throated_Vireo',
    175: 'Artic_Tern',
    176: 'Lazuli_Bunting',
    177: 'Painted_Bunting',
    178: 'Pigeon_Guillemot',
    179: 'Red_cockaded_Woodpecker',
    180: 'Sooty_Albatross',
    181: 'Cardinal',
    182: 'Green_Jay',
    183: 'Chuck_will_Widow',
    184: 'Swainson_Warbler',
    185: 'Yellow_headed_Blackbird',
    186: 'Mangrove_Cuckoo',
    187: 'Parakeet_Auklet',
    188: 'Red_legged_Kittiwake',
    189: 'Red_faced_Cormorant',
    190: 'American_Three_toed_Woodpecker',
    191: 'Baird_Sparrow',
    192: 'Black_capped_Vireo',
    193: 'Slaty_backed_Gull',
    194: 'White_Pelican',
    195: 'Whip_poor_Will',
    196: 'Rhinoceros_Auklet',
    197: 'Spotted_Catbird',
    198: 'Crested_Auklet',
    199: 'Least_Auklet'
}
# Replace with your actual endpoint URL
DATABRICKS_ENDPOINT_URL = 'https://dbc-646e52e6-ebdc.cloud.databricks.com/serving-endpoints/BirdClassificationModel/invocations'

# Get the Databricks token from environment variable or use a placeholder

HEADERS = {
    'Authorization': f'Bearer {os.getenv("DATABRICKS_TOKEN")}',
    'Content-Type': 'application/json'
}

def load_and_preprocess_image(image_file) -> np.ndarray:
    image = Image.open(image_file).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image).astype(np.float32) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=400, detail="Invalid image type. Only JPEG and PNG are supported.")

    contents = await file.read()
    image_file = io.BytesIO(contents)

    try:
        input_data = load_and_preprocess_image(image_file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

    input_list = input_data.tolist()
    payload = json.dumps({'inputs': input_list})

    try:
        response = requests.post(DATABRICKS_ENDPOINT_URL, headers=HEADERS, data=payload)
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Databricks endpoint: {str(e)}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    # Parse the response and map the highest probability to the class label
    try:
        response_json = response.json()
        # Adjust the parsing logic based on the actual response structure
        if 'predictions' in response_json:
            probabilities = response_json['predictions'][0]
        elif 'prediction' in response_json and 'predictions' in response_json['prediction']:
            probabilities = response_json['prediction']['predictions'][0]
        else:
            raise ValueError("Predictions not found in the response.")

        probabilities = np.array(probabilities)
        predicted_index = np.argmax(probabilities)
        predicted_class = index_to_class[predicted_index]
        predicted_probability = probabilities[predicted_index]

        # Return only the predicted class and confidence
        return {
            'predicted_class': predicted_class,
            'confidence': f"{predicted_probability:.2%}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing prediction response: {str(e)}")