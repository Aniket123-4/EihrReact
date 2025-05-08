/** add this after Content.......
   <script src="JavaScript/HindiUnicode.js" type="text/javascript" ></script>
 */
/*
declare radiobutton list as markup
                                 <asp:RadioButtonList ID="rblLang" runat="server" RepeatDirection="Horizontal">
                                     <asp:ListItem Text="English" Selected="True" Value="English"></asp:ListItem>
                                     <asp:ListItem Text="Hindi" Value="Hindi"></asp:ListItem>
                                 </asp:RadioButtonList>

javascript if in update panel then inside update panel 
     <script type='javascript'>
     $(document).ready(function () {
                    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(celClas);
                });
                function celClas() {
                    $("[id$='rblLang']").on('click', radioBVal);
                    $("textarea[id*='txt'],input[type=text]").on('keyup', KruToUniC);  //this will attach conversion scrip on all input and textarea containing txt
                }
     </script>
if Not in update 
$(function(){
                    $("[id$='rblLang']").on('click', radioBVal);
                    $("textarea[id*='txt'],input[type=text]").on('keyup', KruToUniC);

});
*/
var langSel = 'English';
function radioBVal() {
    var v = $("[id='" + $(this).attr('id') + "']  input[type=radio]:checked").val();
    langSel = v;
    return v;
}
function KruToUniC(tbv) { //this is for single char
    var key = tbv.keyCode || tbv.charCode;
    if ((key == 8) || (key == 37) || (key == 39) || (key == 46))
        return;
    //                    alert(key);

/* local solution
    var lsel = $("[id$='rbtnLang'] input:checked").val();
    if (lsel != 'Hindi')
        return;
*/
    if (langSel.toLowerCase().indexOf('hi') < 0)
        return;
    var v = $(this).val();
  //  v = v.replace('  ', ' ');
    var sp1 = '';
    var sp2 = '';
    var sp3 = '';
    var sr = '';
    var re = false;
    //var pos = $(this).getCursorPosition(); //fails on 2nd time
  //  var pos = v.slice(0, $(this).selectionStart).length;

    var v1 = $(this)[0].selectionStart;
    var v2 = $(this)[0].selectionEnd;
//    pos = v1;
    var Cha = v[v1 - 1];
    if (Cha == ' ')
        return;
//    alert(v[v1 - 1]);
    var res = convert_to_unicode2(Cha);
    var z1 = v.substring(v1);
    //    if (z1 != 'undefined')
    //      v = v + v.substring(v2);
    var z2 = v.substring(v1 + 1, v1 + 2);
    v = v.substring(0, v1 - 1) + res + z1;// + v.substring(v1);
    //    v = res;
    
    $(this).val(v);
    //    $(this).select();
    $(this).selectRange(v1, v1);
    return;

}
/******** this is plugin taken to set cursor position ****/
$.fn.selectRange = function (start, end) {
    var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/
    if (!e) return;
    else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */
    else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
    else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
};

function KruToUni(tbv) { //this is for full word and currently not in use
    var key = tbv.keyCode || tbv.charCode;
    if ((key == 8) || (key == 37)  || (key == 39) || (key == 46))
        return;
//                    alert(key);
    var lsel = $("[id$='rbtnLang'] input:checked").val();
    if (lsel != 'Hindi')
        return;
    var v = $(this).val();
    v = v.replace('  ', ' ');
    var sp1 = '';
    var sp2 = '';
    var sp3 = '';
    var sr = '';
    var re = false;
    //var pos = $(this).getCursorPosition(); //fails on 2nd time
    var pos = v.slice(0, $(this).selectionStart).length;

    var v1 = $(this)[0].selectionStart;
    var v2 = $(this)[0].selectionEnd;
    pos = v1;

    if ((pos == 1) || (pos == 0))
        return;
    var a1 = v[pos - 1];
    var a2 = v[pos];
    var a3 = v[pos + 1];
    if (v[pos - 1] != ' ') 
        return;
    //            v = v.trim();
    var le = v.length - 1;  //
    if (pos == v.length) {
        while (le > -1) {
            if ((v[le] == ' ') && ((v.length - 1) != le))
                break;
            sp2 = sp2 + v[le];
            le = le - 1;
        }
        for (var a = 0; a < le; a++) {
            sp1 = sp1 + v[a];
        }
        sp2 = reverse(sp2);
        var r = convert_to_unicode2(sp2);
        v = v.replace(sp2, r);
        $(this).val(v);
        return;
    }
    var po1 = pos - 1;
    while (po1 > -1) {
        if ((v[po1] == ' ') && (po1 != (pos - 1)))
            break;
        sp2 = sp2 + v[po1];
        po1 = po1 - 1;
    }
    sp2 = reverse(sp2);
    //                alert('sp2:' + sp2);
    pos = pos - sp2.length;
    sp1 = v.substring(0, pos);
    if (sp2 == '')
        return;
    //              alert(':'+sp1+':');
    //            alert(':'+sp2+':');
    sp3 = v.substring(sp1.length + sp2.length);
    //alert(':' + sp3 + ':');
    // if (sp3 == '')
    //   return;
    sp2 = convert_to_unicode2(sp2);
    var vf = sp1 + ' ' + sp2 + ' ' + sp3;
    //          alert(vf);
    var a34 = vf.trim();
    a34 = a34.replace('  ', ' ');
    $(this).val(a34);
    return;
}
function reverse(s) {
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
}


var array_one = new Array(

"aa", "a",
"ZZ", "Z",
"=kk", "=k",
"f=k", "f=",

"Q+Z", "QZ+",
"sas", "sa",

"‘", "\"",
"’", "\"",
"“", "'",
"”", "'",

"ƒ", "१",
"„", "२",
"…", "३",
"†", "४",
"‡", "५",
"ˆ", "६",
"‰", "७",
"Š", "८",
"‹", "९",
"Œ", "०",
"å", "०",

"v‚", "ऑ",
"vks", "ओ",
"vkS", "औ",
"vk", "आ",
"v", "अ",
"b±", "ईं",
"Ã", "ई",
"bZ", "ई",
"b", "इ",
"m", "उ",
"Å", "ऊ",
",s", "ऐ",
",", "ए",
"_", "ऋ",


"d+", "क़",
"[+", "ख़्",
"x+", "ग़",
"T+", "ज़्",
"t+", "ज़",
"M+", "ड़",
"<+", "ढ़",
"¶+", "फ़्",
"Q+", "फ़",
";+", "य़",
"j+", "ऱ",
"u+", "ऩ",

"d", "क",
"D", "क्",
"£", "ख्र",
"[", "ख्",
"x", "ग",
"X", "ग्",
"Ä", "घ",
"?", "घ्",
"³", "ङ",
"p", "च",
"P", "च्",
"N", "छ",
"t", "ज",
"T", "ज्",
">", "झ",
"÷", "झ्",
"Ö", "झ्",
"¥", "ञ",
"V", "ट",
"B", "ठ",
"M", "ड",
"<", "ढ",
".", "ण्",
"r", "त",
"R", "त्",
"F", "थ्",
"n", "द",
"/", "ध्",
"Ë", "ध्",
"è", "ध्",
"u", "न",
"U", "न्",
"i", "प",
"I", "प्",
"Q", "फ",
"¶", "फ्",
"c", "ब",
"C", "ब्",
"Ò", "भ",
"H", "भ्",
"e", "म",
"E", "म्",
";", "य",
"¸", "य्",
"j", "र",
"y", "ल",
"Y", "ल्",
"G", "ळ",
"Üo", "श्व",
"Ük", "श", // as used in 'shringaal' etc
"Üz", "श्र्",
"o", "व",
"O", "व्",

"'", "श्",
"\"", "ष्",
"l", "स",
"L", "स्",
"g", "ह",

"Ñ", "कृ",
"—", "कृ",
"ô", "क्क",
"ä", "क्त",
"{", "क्ष्",
"K", "ज्ञ",

"ê", "ट्ट",
"Í", "ट्ट",
"ë", "ट्ठ",
"Î", "ट्ठ",
"ð", "ठ्ठ",
"Ï", "ड्ड",
"ì", "ड्ड",
"ï", "ड्ढ",
"Ô", "ड्ढ",

"Ù", "त्त्",
"=", "त्र",
"«", "त्र्",
"–", "दृ",
"Ì", "द्द",
"í", "द्द",
"\)", "द्ध",
"˜", "द्भ",
"ö", "द्भ",
"|", "द्य",
"}", "द्व",
"é", "न्न",
"™", "न्न्",

"ó", "स्त्र",
"â", "हृ",
"à", "ह्न",
"ã", "ह्म",
"á", "ह्य",
"º", "ह्",

"J", "श्र",
"Ø", "क्र",
"Ý", "फ्र",
"æ", "द्र",
"ç", "प्र",
"Á", "प्र",
"#", "रु",
":", "रू",

"Ó", "्य",
"î", "्य",
"z", "्र",
"ª", "्र",

// "Ç" ,	"िं", 
"È", "ीं",
"Ê", "Zी",
"\›", "Zैं",
"õ", "Zैं",
"±", "Zं",
"Æ", "र्f",
"É", "र्Ç",

"्k", "",

"‚", "ॉ",
"¨", "ो",
"®", "ो",
"ks", "ो",
"©", "ौ",
"kS", "ौ",
"h", "ी",
"q", "ु",
"w", "ू",
"`", "ृ",
"s", "े",
"¢", "े", //suitable for ka
"S", "ै",
"a", "ं",
"¡", "ँ",
"%", "ः",
"W", "ॅ",
"•", "ऽ",
"·", "ऽ",
"∙", "ऽ",
"·", "ऽ",
"~", "्",
"+", "़",
"k", "ा",

"A", "।",
"ñ", "॰",  // laaghava

"\\", "?",
" ः", " :",
"^", "‘",
"*", "’",
"Þ", "“",
"ß", "”",
"(", ";",
"¼", "(",
"½", ")",
"¿", "{",
"À", "}",
"¾", "=",
"-", ".", // full stop?
"&", "-",
//"&" ,	"µ" ,
"]", ",",
"@", "/",

"~ ", "् ",
"ाे", "ो",
"ाॅ", "ॉ",
"े्र", "्रे",
"अौ", "औ",
"अो", "ओ",
"आॅ", "ऑ")


function convert_to_unicode2(evt) {
/*    var rb = document.getElementById("ctl00_MasterContent_rbtnLang");
    var radio = rb.getElementsByTagName("input");
    var label = rb.getElementsByTagName("label");
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {*/
            //alert("SelectedText: " + label[i].innerHTML
            //    + "\nSelectedValue: " + radio[i].value);
          //  if (radio[i].value == "Hindi") {
  
                var array_one_length = array_one.length;

                //var modified_substring = document.getElementById('<%=txtFonts.ClientID%>').value;  sandeep
                var modified_substring = evt;// evt.value;
                //************************************************************
                //  Break the long text into small bunches of max. max_text_size  characters each.
                //*************************************************************
                //var text_size = document.getElementById('<%=txtFonts.ClientID%>').value.length; sandeep
                var text_size = evt.length;// evt.value.length;
                var processed_text = '';  //blank

                var sthiti1 = 0; var sthiti2 = 0; var chale_chalo = 1;

                var max_text_size = 6000;

                while (chale_chalo == 1) {
                    sthiti1 = sthiti2;

                    if (sthiti2 < (text_size - max_text_size)) {
                        sthiti2 += max_text_size;
                        //while ((document.getElementById('<%=txtFonts.ClientID%>').value.charAt(sthiti2) != '\n') & (document.getElementById('<%=txtFonts.ClientID%>').value.charAt(sthiti2) != '\t') & (document.getElementById('<%=txtFonts.ClientID%>').value.charAt(sthiti2) != ' ')) { sthiti2--; } sandeep

                        // while ((evt.value.charAt(sthiti2) != '\n') & (evt.value.charAt(sthiti2) != '\t') & (evt.value.charAt(sthiti2) != ' ')) { sthiti2--; }
                        while ((evt.charAt(sthiti2) != '\n') & (evt.charAt(sthiti2) != '\t') & (evt.charAt(sthiti2) != ' ')) { sthiti2--; }
                    }
                    else { sthiti2 = text_size; chale_chalo = 0 }

                    var modified_substring = evt.substring(sthiti1, sthiti2); //evt.value.substring(sthiti1, sthiti2);

                    Replace_Symbols();

                    processed_text += modified_substring;

                    //***************************************************************
                    //  Breaking part code over
                    //***************************************************************


                    // evt.value = processed_text;
                    return processed_text;
                }


                // --------------------------------------------------

                function Replace_Symbols() {

                    //substitute array_two elements in place of corresponding array_one elements

                    if (modified_substring != "")  // if stringto be converted is non-blank then no need of any processing.
                    {
                        for (input_symbol_idx = 0; input_symbol_idx < array_one_length - 1; input_symbol_idx = input_symbol_idx + 2) {

                            idx = 0;  // index of the symbol being searched for replacement

                            while (idx != -1) //whie-00
                            {

                                modified_substring = modified_substring.replace(array_one[input_symbol_idx], array_one[input_symbol_idx + 1])
                                idx = modified_substring.indexOf(array_one[input_symbol_idx])

                            } // end of while-00 loop
                        } // end of for loop


                        // following statements for adjusting postion of i maatraas.

                        modified_substring = modified_substring.replace(/([fÇ])([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$1");

                        modified_substring = modified_substring.replace(/([fÇ])(्)([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$3$1");

                        modified_substring = modified_substring.replace(/([fÇ])(्)([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])/g, "$2$3$1");

                        modified_substring = modified_substring.replace(/f/g, "ि");
                        modified_substring = modified_substring.replace(/Ç/g, "िं");


                        //following three statement for adjusting position of reph ie, half r .
                        modified_substring = modified_substring.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([ािीुूृेैोौंँ]*)([Z])/g, "$3$1$2");

                        modified_substring = modified_substring.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([्])([Z])/g, "$3$1$2");

                        modified_substring = modified_substring.replace(/([कखगघङचछजझञटठडड़ढढ़णतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़])([्])([Z])/g, "$3$1$2");

                        modified_substring = modified_substring.replace(/Z/g, "र्");

                        // remove maatras typed wrongly
                        modified_substring = modified_substring.replace(/([ंँ॰])([ािीुूृेैोौ])/g, "$2$1");

                        modified_substring = modified_substring.replace(/([ािीुूृेैोौंँ])([ािीुूृेैोौ])/g, "$1");

                    } // end of IF  statement  meant to  supress processing of  blank  string.

                } // end of the function  Replace_Symbols

       /*     }
        }
    }*/
}