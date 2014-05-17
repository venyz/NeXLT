#!/bin/bash
#
# ©2013–2014 Autodesk Development Sàrl
#
# Creted by Mirko Plitt
#
# Changelog
# v2.0.2	Modified by Ventsislav Zhechev on 17 May 2014
# Updated the list of jars in the classpath.
#
# v2.0.1	Modified by Ventsislav Zhechev on 16 May 2014
# The Java tool now submits the data directly to Solr for indexing.
#
# v2.			Modified by Ventsislav Zhechev on 15 Apr 2014
# Added a #! to make this script a proper executable.
# Removed unnecessary commands, as AthenaExportMt now produces proper output for Solr.
#
# v1.			Modified by Mirko Plitt
# Initial version
#

echo "*****************************************************"
date
cd /local/cms/NeXLT/nexlt/athena2nexlt
rm -f *.csv
java -cp bzip2.jar:oracle_11203_ojdbc6.jar:httpclient-4.3.3.jar:httpcore-4.3.2.jar:commons-logging-1.1.3.jar:json-simple-1.1.1.jar:. AthenaExportMt jdbc:oracle:thin:@oracmsprd1.autodesk.com:1521:CMSPRD1 cmsuser Ten2Four ALL $(date --date yesterday +%Y.%m.%d) $(date +%Y.%m.%d) 0 1
