var QRCoder = function() {
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    // advanced mode switch
    $('#mode').on('click', function(e) {
        e.preventDefault();
        $(this).val($(this).val() == 'Advanced' ? 'Easy' : 'Advanced');
        $('#options').toggleClass('show');
    });

    // generate a QR Code
    $('#generate').on('click', function(e) {
        e.preventDefault();

        var container = $('#container').empty();
        var qrcode = $('<div>').appendTo(container);

        // set options
        var foreground = $('input[name=foreground]').val(),
                background = $('input[name=background]').val(),
                version = $('select[name=version]').val(),
                ecc = $('select[name=ecc]').val(),
                rs = 6;
        // rs is rect size
        // "version" can be 1-40 see http://www.denso-wave.com/qrcode/qrgene2-e.html
        try {
            // QR Code Error Correction Capability 
            // Higher levels improves error correction capability while decreasing the amount of data QR Code size.
            // QRErrorCorrectLevel.L (5%) QRErrorCorrectLevel.M (15%) QRErrorCorrectLevel.Q (25%) QRErrorCorrectLevel.H (30%)
            // eg. L can survive approx 5% damage...etc.
            var qr = new QRCode(version, QRErrorCorrectLevel.L);
            qr.addData(utf16to8($('input[name=content]').val()));
            qr.make();
            var count = qr.getModuleCount();
        }
        catch (err) {
            console.log(err);
            var errorChild = document.createElement("p");
            var errorMSG = document.createTextNode("QR Code FAIL! " + err);
            errorChild.appendChild(errorMSG);
            return errorChild;
        }

        // create a SVG
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("version", "1.2");
        svg.setAttribute("baseProfile", "tiny");
        svg.setAttribute('width', qr.getModuleCount() * rs);
        svg.setAttribute('height', qr.getModuleCount() * rs);
        qrcode[0].appendChild(svg);

        // background
        var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("x", 0);
        bg.setAttribute("y", 0);
        bg.setAttribute("width", count * rs);
        bg.setAttribute("height", count * rs);
        bg.setAttribute("fill", background);
        svg.appendChild(bg);

        // draw QR Code
        for (var row = 0; row < count; row++) {
            for (var column = 0; column < count; column++) {
                if (qr.isDark(row, column)) {
                    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    rect.setAttribute("x", column * rs);
                    rect.setAttribute("y", row * rs);
                    rect.setAttribute("width", rs);
                    rect.setAttribute("height", rs);
                    rect.setAttribute("fill", foreground);
                    svg.appendChild(rect);
                }
            }
        }

        // set a download link
        $('<a>')
                .attr('class', 'button orange')
                .data('icon', '↴')
                .html('DOWNLOAD as SVG')
                .on('click', function(e) {
            // save as a SVG 
            // saveAS() function from FileSaver.min.js
            // https://github.com/eligrey/FileSaver.js
            var blob = new Blob([qrcode.html()], {
                'type': ("image/svg+xml")
            });
            saveAs(blob, "qrcode.svg");
        }).appendTo(container);

        valigner();

    });

    var valigner = function() {
        console.log('sdfsf');
        var top = ($(window).height() - $('article').height()) * .5;
        $('article').css('margin-top', top > 40 ? top : 40);
    };
    valigner();
    // run automagickly
    $('input[name=content]').on('keydown', function(e) {
        if (e.keyCode === 13) {
            $('#generate').trigger('click');
            $('.button').addClass('active');
        }
    }).on('keyup', function(e) {
        if (e.keyCode === 13) {
            $('.button').removeClass('active');
        }
    }).focus();
};

$().ready(QRCoder);