'use strict'

const Project = require("../models/project");
const Fs = require('fs');
const path = require("path");

var controller = {

    home: function(req, res){
        return res.status(200).send({
            message: 'Soy la home'
        });
    },

    test: function(req, res){
        return res.status(200).send({
            message:'Soy el metodo o accion test del controlador de project'
        });
    },

    saveProject: function(req, res){
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored)=> {
            if(err) return res.status(500).send({message:'Error al guardar documento.'});
            if (!projectStored) return res.status(404).send({message:'No se ha podido guardar el documento en la base de datos.'});

            return res.status(200).send({project: projectStored});
        });
    },

    getProject:  function(req, res){
        var projectId = req.params.id;

        if(projectId == null) return res.status(404).send({message:'El proyecto no existe'});

        Project.findById(projectId, (err, project) => {
            if(err) return res.status(500).send({message:'Error al devolver los datos del proyecto'});

            if(!project) return res.status(404).send({message:'El proyecto no existe en la base de datos'});

            return res.status(200).send({
                project
            });
        });
    },

    getProjects: function(req, res){
        Project.find({}).sort('-year').exec((err, projects) => {
            if(err) return res.status(500).send({message:'Error al devolver los datos'});

            if(!projects) return res.status(400).send({messaje: 'No hay projectos que devolver'});

            return res.status(200).send({projects});
        });
    },

    updateProjecct: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdate) => {
            if(err) return res.status(500).send({message:'Error al actualizar'});
            if(!projectUpdate) return res.status(404).send({message:'No existe projecto para actiualizar'});

            return res.status(200).send({
                project: projectUpdate
            });
        });
    },

    deleteProject: function(req, res){
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectDelete)=>{
            if(err) return res.status(500).send({message:'Error al eliminar proyecto'});
            if(err) return res.status(404).send({message:'El proyecto a eliminar no existe'});

            return res.status(200).send({
                proyect: projectDelete
            });
        });
    },

    uploadImage: function(req, res){
        var projectId =  req.params.id;
        var file_name = 'Imagen no subida...';
        
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                
                Project.findByIdAndUpdate(projectId, {image:fileName}, {new:true}, (err, projectUpdate) =>{
                    if(err) return res.status(500).send({message: 'La imagen no ha sido subida'});
                    if (!projectUpdate) return res.status(404).send({message: 'El projecto no existe'});
    
                    return res.status(200).send({
                        project: projectUpdate
                    });
    
                });


            }else{
                Fs.unlink(filePath, (err) => {
                    return res.status(200).send({message:'El formaro de la imagen no es valido'})
                })
            }

            
           

        }else{
            return res.status(200).send({
                message: file_name
            });
        }

    },

    getImageFile: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/'+file;

        Fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({
                    message: "No existe la imagen..."
                });
            }
        });
    }


};

module.exports = controller;