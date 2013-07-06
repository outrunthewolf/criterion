$(document).ready(function() {
    $('.timeago').timeago();

    $('#addProject').on('shown', function () {
        $('#repo_url').focus();
    });

    $('.delete_project').on('click', function() {
        criterion.project.delete(this);
    });
});

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

var criterion = {
    project : {
        delete : function(el) {
            var el = $(el);
            el.attr('disabled', true);
            var id = el.data('id');
            var sure = confirm('Are you sure you wish to delete this project?');
            if (sure) {
                window.location.href = '/project/delete/' + id;
            } else {
                el.removeAttr('disabled');
                return false;
            }
        }
    },
    test : {
        getStatus : function(id) {
            $.get('/test/status/' + id, function(data) {

                if (data.status.code == '1') {
                    var status_class = 'success';
                    clearInterval(build);
                } else if (data.status.code == '3') {
                    var status_class = 'warning';
                } else if (data.status.code == '0') {
                    var status_class = 'important';
                } else {
                    var status_class = 'info';
                }

                $('#status').text(data.status.message);
                $('#status').removeClass().addClass('label').addClass('label-' + status_class);
                if (typeof data.commit != 'undefined') {

                    if (data.commit.url) {
                        $('#commit-hash').html(
                            '<a href="' + data.commit.url + '">' +
                                data.commit.hash.short +
                            '</a>'
                        );
                    } else {
                        $('#commit-hash').text(data.commit.hash.short);
                    }


                    $('#commit-author').text(data.commit.author.name);

                    if (data.commit.branch.url) {
                        $('#branch').html(
                            '<a href="' + data.commit.branch.url + '">' +
                                data.commit.branch.name +
                            '</a>'
                        );
                    } else {
                        $('#branch').text(data.commit.branch.name);
                    }
                }

                if (data.log.length > 0) {
                    $('#logs').html('');
                    $.each(data.log, function(key, val) {

                        if (val.response == '0') {
                            var hide_class = 'hide';
                            var alert = 'success';
                        } else {
                            var hide_class = false;
                            var alert = 'error';
                        }

                        if (val.output == '') {
                            val.output = 'There is no output for this command.';
                        }

                        $('#logs').append(
                        '<div>' +
                            '<a href="javascript:void(0)" class="output-log">' +
                                '<p class="'+alert+' ">' +
                                    '<span class="dollar">$</span> ' + val.command +
                                '</p>' +
                            '</a>' +
                            '<div class="output ' + hide_class + '">' +
                                nl2br(val.output) +
                            '</div>' +
                        '</div>');
                    });

                    $('.output-log').on('click', function(){
                        $(this).next().toggle();
                    });
                }

            });
        }
    }
}

