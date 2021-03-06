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

const IMG_VAL = {
	"f84f48d21bb315143afa757e03c793e1f4dcf6e2": 0,
	"7ee3e46eecb90af753d79c34db2e79dc9b26f8a3": 1,
	"d333904d5a1999c810d8f647aeb67e5da2dda7d9": 2,
	"597176badd014337bd3ccf926e95b7effc166dda": 3,
	"fbf383163f049a337ded222ca5967c80e8b25976": 4,
	"7d48b914653945e3046fa313eff2b86bff00d9a5": 5,
	"3723149078045b8ce715ed49bc913081ccbe8906": 6,
	"a4bd01f28f0f4765a7d9dc0eff4806e537717d63": 7,
	"fab83026abf0715323778f98e5ad02a34405c5f2": 8,
	"e5103759510a22ed2af82a87c035f5b56c4dd89f": 9,
};
const VAL_POS = new Array();


const USERNAME_INPUT_ID = 'val_cel_dentifiant';
const PASSWORD_INPUT_ID = 'cs';

function _get(id) {
	return document.getElementById(id);
}

function _set(id, value) {
	return document.getElementById(id).value = value;
}

function parseImgs() {
	var img_val = "";
	for(var i = 0 ; i <= 9 ; i++) {
		var img = _get('val_cel_' + i).firstChild.firstChild;
		var b64 = img2base64(img);
		var sha1 = SHA1(b64);
		var val = IMG_VAL[sha1];
		VAL_POS[val] = i;
	}
}

function getPositionsFromValue(value) {
	var positions = '';
	for(var i = 0 ; i < value.length ; i++) {
		var v = value.charAt(i);
		var p = VAL_POS[v];
		positions += p;
	}
	return positions;
}

function fillForm(credential) {
	parseImgs();
	_set(USERNAME_INPUT_ID, credential.username);
	_set(PASSWORD_INPUT_ID, getPositionsFromValue(credential.password));
	return true;
}

function validate() {
	document.forms["formAccesCompte"].submit();
	return true;
}

