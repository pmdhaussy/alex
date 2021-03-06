/*
 * Auto Login Extension or ALEx, allows you to easily log in on websites
 * with tiresome security systems, such as banks.  
 * Copyright (C) 2012 Bruno Macherel, Pierre-Marie Dhaussy, Aurélie Gandour
 * <auto-login-extension@googlegroups.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  See LICENSE.txt or <http://www.gnu.org/licenses/  >.
 */

const CHIFFRES_BOUTON = document.getElementsByClassName('ident_chiffre_img');
const PASSWORD_INPUT = document.getElementsByName("pwd_abo")[0];
const SUBMIT_BUTTON = document.getElementById("ident_btn_submit");

var pos = new Array();

/**
 * Detect which number correspond to each image
 */
function ocr() {
	for(var i=0; i<CHIFFRES_BOUTON.length; i++) {
		var img = CHIFFRES_BOUTON[i];
		var canvas = getCanvas(img);
		for (var p in POINTS) {
			var points = POINTS[p];
			if(check(canvas, points)) {
				pos[p] = i;
				break;
			}
		}
	}
}

/**
 * Vérifie si l'image valide une des séries de points fournies
 */
function check(canvas, points) {
	var image = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	var data = image.data;
	for(var p in points) {
		var point = points[p];
		var i = point.x*4 + point.y*4 * canvas.width;
		var white = (data[i] == 255 && data[i+1] == 255 && data[i+2] == 255);
		if(!((point.c==0 && white) || (point.c==1 && !white))) {
			return false;
		}
	}
	return true;
}

/**
 * Return a canvas object correponding to an img HTML element
 */
function getCanvas(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas;
}

/**
 * Try to authenticate the user
 */
function authenticate(credential) {
	var error = undefined;
	// Parcours du login pour cliquer sur les chiffres correspondants
	for(var i in credential.username) {
		var n = parseInt(credential.username[i]);
		if(n == NaN) {
			if(!error) error = new IncorrectLoginError();
			console.error("Le login doit contenir uniquement des chiffres");
		} else {
			// Recherche de la position du bouton correspondant au chiffre 'n'
			var p = pos[n];
			if(p == undefined) {
				if(!error) error = new ImageRecognitionError();
				console.error("L'image correspondant au chiffre " + n + " n'a pas été reconnu.");
			} else {
				// On a trouvé le bouton correspondant au chiffre, on peut cliquer dessus.
				if(!error) {
					CHIFFRES_BOUTON[p].click();
				}
			}
		}
	}
	// On renseigne le mot de passe
	PASSWORD_INPUT.value = credential.password;
	if(!!error) {
		var element = document.getElementsByClassName('ident_chiffre2')[0];
		element.innerHTML = '<h1>' + credential.username + '</h1>' + element.innerHTML;
		throw error;
	}
}

function fillForm(credential) {
	if(!credential) {
		console.warn("Merci de configurer le script avant de l'exécuter.");
	} else {
		if(!!SUBMIT_BUTTON){
			ocr();
			authenticate(credential);
		}
	}
	return true;
}

function validate() {
	// On soumet le formulaire
	SUBMIT_BUTTON.click();
	return true;
}

